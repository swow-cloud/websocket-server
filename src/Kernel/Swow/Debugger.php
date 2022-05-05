<?php
/**
 * This file is part of SwowCloud
 * @license  https://github.com/swow-cloud/websocket-server/blob/main/LICENSE
 */

declare(strict_types=1);

namespace SwowCloud\WsServer\Kernel\Swow;

use League\CLImate\CLImate;

class Debugger extends \Swow\Debug\Debugger
{
    private CLImate $climate;

    public function __construct()
    {
        parent::__construct();
        $this->climate = new CLImate();
    }

    /**
     * 终端输出增加颜色控制
     *TODO
     * @return $this
     */
    public function out(string $string = '', bool $newline = true, string $color = 'green'): static
    {
        $buffer = $this->climate->output->get('buffer');
        /* @noinspection PhpPossiblePolymorphicInvocationInspection */
        $buffer->clean();
        $this->climate->to('buffer')->{$color}($string);
        /* @noinspection PhpPossiblePolymorphicInvocationInspection */
        $this->output->write([rtrim($buffer->get(), "\n"), $newline ? "\n" : null]);

        return $this;
    }

    public function error(string $string = '', bool $newline = true): static
    {
        $this->out($string, $newline, 'error');

        return $this;
    }

    public function exception(string $string = '', bool $newline = true): static
    {
        $this->out($string, $newline, 'error');

        return $this;
    }
}
